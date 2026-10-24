import React, { useEffect, useState } from 'react';

type Plan = {
  id: string;
  name: string;
  priceCents: number;
  interval: 'month' | 'year';
};

type BillingInfo = {
  currentPlanId: string | null;
  nextInvoiceDate: string | null;
  paymentMethodLast4: string | null;
};

const PLANS: Plan[] = [
  { id: 'basic-monthly', name: 'Basic', priceCents: 900, interval: 'month' },
  { id: 'pro-monthly', name: 'Pro', priceCents: 2900, interval: 'month' },
  { id: 'pro-yearly', name: 'Pro (annual)', priceCents: 29000, interval: 'year' },
];

function formatPrice(cents: number, interval: Plan['interval']): string {
  const dollars = (cents / 100).toFixed(2);
  return `$${dollars} / ${interval}`;
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changingPlan, setChangingPlan] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/billing');
        if (!res.ok) throw new Error(`Failed to load billing (${res.status})`);
        const data: BillingInfo = await res.json();
        if (!cancelled) setBilling(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function changePlan(planId: string) {
    setChangingPlan(planId);
    setError(null);
    try {
      const res = await fetch('/api/billing/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      if (!res.ok) throw new Error(`Failed to change plan (${res.status})`);
      const data: BillingInfo = await res.json();
      setBilling(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setChangingPlan(null);
    }
  }

  if (loading) return <div className="billing-page">Loading billing…</div>;

  return (
    <div className="billing-page">
      <h1>Billing</h1>

      {error && <div className="billing-error" role="alert">{error}</div>}

      <section className="billing-summary">
        <h2>Current plan</h2>
        <p>
          {billing?.currentPlanId
            ? PLANS.find((p) => p.id === billing.currentPlanId)?.name ?? billing.currentPlanId
            : 'No active plan'}
        </p>
        {billing?.nextInvoiceDate && <p>Next invoice: {billing.nextInvoiceDate}</p>}
        {billing?.paymentMethodLast4 && <p>Card ending in {billing.paymentMethodLast4}</p>}
      </section>

      <section className="billing-plans">
        <h2>Change plan</h2>
        <ul>
          {PLANS.map((plan) => {
            const isCurrent = billing?.currentPlanId === plan.id;
            return (
              <li key={plan.id}>
                <span>{plan.name}</span> — <span>{formatPrice(plan.priceCents, plan.interval)}</span>{' '}
                <button
                  type="button"
                  disabled={isCurrent || changingPlan !== null}
                  onClick={() => changePlan(plan.id)}
                >
                  {isCurrent ? 'Current' : changingPlan === plan.id ? 'Switching…' : 'Switch'}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
