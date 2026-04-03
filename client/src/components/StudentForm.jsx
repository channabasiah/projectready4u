import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentForm({ apiUrl, onSuccess }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onChange', reValidateMode: 'onChange', shouldUnregister: false });

  const [sameAsPhone, setSameAsPhone] = useState(false);
  const phoneValue = watch('phone', '');
  const whatsappValue = watch('whatsapp', '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    if (sameAsPhone) {
      data.whatsapp = phoneValue;
    }
    try {
      await axios.post(`${apiUrl}/api/leads`, data);
      setSuccess(true);
      setSuccessMessage('Thank you! Your details are received. We will contact you soon.');
      setSubmitted(true);
      setShowSuccessModal(true);
      setTimeout(() => {
        setSuccess(false);
        setSuccessMessage('');
        setShowSuccessModal(false);
      }, 6000);
      reset();
      setSameAsPhone(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sameAsPhone) {
      setValue('whatsapp', phoneValue, { shouldValidate: true, shouldDirty: true });
      trigger(['whatsapp']);
    }
  }, [sameAsPhone, phoneValue, setValue, trigger]);

  useEffect(() => {
    if (!sameAsPhone && whatsappValue && whatsappValue !== phoneValue) {
      trigger('whatsapp');
    }
  }, [sameAsPhone, phoneValue, whatsappValue, trigger]);

  const handlePhoneChange = async () => {
    await trigger(['phone', 'whatsapp']);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border border-white/15 rounded-3xl shadow-2xl p-6">
      <h2 className="text-3xl font-bold text-white mb-4">Register Your Interest</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            {...register('name', { required: 'Name is required' })}
            className="w-full rounded-xl px-4 py-3 border border-white/20 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-violet-400"
          />
          {errors.name && <p className="text-sm text-rose-300 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            {...register('phone', {
              required: 'Phone is required',
              pattern: { value: /^\d{10}$/, message: 'Phone must be 10 digits' },
            })}
            onChange={(e) => {
              // keep form state updated + trigger validation with latest value
              setValue('phone', e.target.value, { shouldValidate: true, shouldDirty: true });
              handlePhoneChange();
            }}
            className="w-full rounded-xl px-4 py-3 border border-white/20 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-violet-400"
          />
          {errors.phone && <p className="text-sm text-rose-300 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <input
            type="tel"
            placeholder="WhatsApp Number"
            disabled={sameAsPhone}
            {...register('whatsapp', {
              required: sameAsPhone ? false : 'WhatsApp is required',
              validate: (value) => {
                if (sameAsPhone) return true;
                if (!value) return 'WhatsApp is required';
                return /^\d{10}$/.test(value) || 'WhatsApp must be 10 digits';
              },
            })}
            className="w-full rounded-xl px-4 py-3 border border-white/20 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-violet-400"
          />
          {errors.whatsapp && <p className="text-sm text-rose-300 mt-1">{errors.whatsapp.message}</p>}
          <label className="inline-flex items-center gap-2 mt-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={sameAsPhone}
              onChange={() => {
                const nextSame = !sameAsPhone;
                setSameAsPhone(nextSame);
                if (nextSame) {
                  setValue('whatsapp', phoneValue, { shouldValidate: true, shouldDirty: true });
                  trigger(['phone', 'whatsapp']);
                }
              }}
              className="h-4 w-4 accent-indigo-600"
            />
            Same as phone
          </label>
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
            })}
            className="w-full rounded-xl px-4 py-3 border border-white/20 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-violet-400"
          />
          {errors.email && <p className="text-sm text-rose-300 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="College Name"
            {...register('college', { required: 'College is required' })}
            className="w-full rounded-xl px-4 py-3 border border-white/20 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-violet-400"
          />
          {errors.college && <p className="text-sm text-rose-300 mt-1">{errors.college.message}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Project Title (optional)"
            {...register('project_title')}
            className="w-full rounded-xl px-4 py-3 border border-white/20 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="City"
            {...register('city', { required: 'City is required' })}
            className="w-full rounded-xl px-4 py-3 border border-white/20 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-violet-400"
          />
          {errors.city && <p className="text-sm text-rose-300 mt-1">{errors.city.message}</p>}
        </div>

        {error && <p className="text-sm text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={loading || submitted}
          className={`w-full py-3 rounded-xl text-black font-bold ${submitted ? 'bg-yellow-500' : loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400'}`}
        >
          {loading ? 'Submitting...' : submitted ? 'Submitted' : 'Submit'}
        </button>

        <AnimatePresence>
          {success && (
            <motion.div
              className="mt-3 p-3 rounded-xl bg-emerald-500/20 text-emerald-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {successMessage || 'Thank you for registering! Our team will reach you soon.'}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="text-6xl mb-4">😊</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                Your details are received. We will contact you soon.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onSuccess) onSuccess();
                }}
                className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-violet-400 hover:to-indigo-400 transition-colors"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
