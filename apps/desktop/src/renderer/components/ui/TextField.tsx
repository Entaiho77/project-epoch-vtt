import { useId, useState, type InputHTMLAttributes } from 'react';
import styles from './TextField.module.css';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({
  label,
  error,
  id,
  className,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={[styles.input, error ? styles.invalid : '', className ?? '']
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

/** Password field with an eye toggle (no confirm-password field, per §4.1). */
export function PasswordField({
  label,
  error,
  id,
  ...rest
}: Omit<TextFieldProps, 'type'>) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [show, setShow] = useState(false);
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input
          id={inputId}
          type={show ? 'text' : 'password'}
          className={[styles.input, error ? styles.invalid : '']
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          title={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

function Eye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.2 3.9M6.2 6.2A16 16 0 0 0 2 12s3.5 7 10 7a10.6 10.6 0 0 0 4-.8" />
    </svg>
  );
}
