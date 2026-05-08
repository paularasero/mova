import { useEffect, useState } from 'react';
import PlanCard from '../components/PlanCard';
import { apiRequest } from '../lib/api';

export default function Home() {
  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    apiRequest('/plans')
      .then((data) => {
        setPlans(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <section className="mx-auto w-full max-w-md space-y-4 px-4 pb-28 pt-6">
      <h2 className="text-2xl font-bold tracking-tight text-ink">Home social</h2>
      {status === 'loading' && <p className="text-sm text-black/60">Cargando planes...</p>}
      {status === 'error' && <p className="text-sm text-red-500">No pudimos cargar los planes.</p>}
      {status === 'ready' && plans.length === 0 && <p className="text-sm text-black/60">Todavía no hay planes.</p>}
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </section>
  );
}
