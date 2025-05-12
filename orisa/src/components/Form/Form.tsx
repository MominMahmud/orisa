import { useState } from 'react';
import styles from './Form.module.scss';
import { motion } from 'framer-motion';

const FloatingLabelInput = ({ label, type = 'text' }: { label: string, type?: string }) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  const hasContent = focused || value.length > 0;

  return (
    <div className={styles.inputGroup}>
      <motion.label
        className={`${styles.label} ${hasContent ? styles.floating : ''}`}
        animate={{
          top: hasContent ? '0.2rem' : '1rem',
          fontSize: hasContent ? '0.75rem' : '1rem',
          color: hasContent ? '#4a90e2' : '#888',
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>
        <input
          className={styles.input}
          type={type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
    </div>
  );
};

const Form = () => {
  return (
    <motion.div
      className={styles.formWrapper}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className={styles.title}>Sign Up for a Demo</h2>
      <form className={styles.form}>
        <FloatingLabelInput label="Name" />
        <FloatingLabelInput label="Organization" />
        <FloatingLabelInput label="Email" type="email" />
        <button type="submit">Send Message</button>
      </form>
    </motion.div>
  );
};

export default Form;
