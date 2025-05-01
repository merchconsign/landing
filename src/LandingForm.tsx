// src/LandingForm.tsx
import { useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function LandingForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'artist' | 'store_owner' | ''>('');
  const [website, setWebsite] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !role) {
      setError('Email and role are required.');
      return;
    }

    const { error: dbError } = await supabase.from('signups').insert([{ email, role, website }]);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    // optional: fire off email via API route (once it's live)
    await fetch('/api/welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center mt-12 text-green-600 text-xl">
        ✅ Thanks! We'll be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center text-gray-800">Get Started with MerchConsign</h1>

      <label className="block">
        <span className="text-gray-700">Your Role:</span>
        <select
          className="mt-1 w-full border rounded p-2"
          value={role}
          onChange={(e) => setRole(e.target.value as 'artist' | 'store_owner')}
          required
        >
          <option value="">Select a role</option>
          <option value="artist">Artist / Designer</option>
          <option value="store_owner">Store Owner</option>
        </select>
      </label>

      <label className="block">
        <span className="text-gray-700">Email Address:</span>
        <input
          type="email"
          className="mt-1 w-full border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="text-gray-700">Website (optional):</span>
        <input
          type="url"
          className="mt-1 w-full border rounded p-2"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </label>

      {error && <div className="text-red-600">{error}</div>}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
