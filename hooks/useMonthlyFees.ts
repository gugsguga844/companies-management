import { useState, useEffect, useMemo } from 'react';
import { getPayments, generatePayments } from '../services/api';
import { addMonths, format, isBefore, isAfter, startOfMonth, endOfMonth, isSameMonth, parseISO } from 'date-fns';

export interface Payment {
  id: number;
  reference_month: string; // ISO string
  value: string;
  status: 'PENDENTE' | 'PAGO';
  payment_date: string | null;
  due_date: string;
  company_id: number;
  company: {
    name: string;
    is_active: boolean;
  };
}

export interface MonthlySummary {
  month: Date;
  payments: Payment[];
  total: number;
  recebido: number;
  pendente: number;
  atrasado: number;
}

export function useMonthlyFees() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));

  // Limite de navegação: 12 meses à frente do mês atual
  const maxMonth = useMemo(() => addMonths(startOfMonth(new Date()), 11), []);
  const minMonth = useMemo(() => startOfMonth(new Date()), []);

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      setError(null);
      try {
        const response = await getPayments();
        setPayments(response.data || []);
      } catch (err: any) {
        setError('Erro ao buscar pagamentos');
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  // Agrupa e calcula os totais do mês selecionado
  const summary: MonthlySummary = useMemo(() => {
    const monthPayments = payments.filter(p =>
      isSameMonth(parseISO(p.reference_month), currentMonth)
    );
    let total = 0, recebido = 0, pendente = 0, atrasado = 0;
    const today = new Date();
    monthPayments.forEach(p => {
      const value = Number(p.value);
      total += value;
      if (p.status === 'PAGO') {
        recebido += value;
      } else if (p.status === 'PENDENTE') {
        if (isBefore(parseISO(p.due_date), today)) {
          atrasado += value;
        } else {
          pendente += value;
        }
      }
    });
    return {
      month: currentMonth,
      payments: monthPayments,
      total,
      recebido,
      pendente,
      atrasado,
    };
  }, [payments, currentMonth]);

  function goToPrevMonth() {
    setCurrentMonth(prev => {
      const newMonth = addMonths(prev, -1);
      return isBefore(newMonth, minMonth) ? minMonth : newMonth;
    });
  }

  function goToNextMonth() {
    setCurrentMonth(prev => {
      const newMonth = addMonths(prev, 1);
      return isAfter(newMonth, maxMonth) ? maxMonth : newMonth;
    });
  }

  async function ensureFuturePayments(month: Date) {
    // Garante que existe fatura para o mês informado
    const exists = payments.some(p => isSameMonth(parseISO(p.reference_month), month));
    if (!exists) {
      await generatePayments({ reference_month: format(month, 'yyyy-MM-01') });
    }
  }

  return {
    summary,
    currentMonth,
    setCurrentMonth,
    goToPrevMonth,
    goToNextMonth,
    minMonth,
    maxMonth,
    loading,
    error,
    ensureFuturePayments,
  };
} 