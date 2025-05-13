import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, collection, addDoc, getDocs, query, where } from '../../config/firebaseConfig.ts';
import styles from './Form.module.scss';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';


const FloatingLabelInput = ({
    label,
    type = 'text',
    setName,
    setValueProp,
}: {
    label: string;
    type?: string;
    setName?: (name: string) => void;
    setValueProp?: (value: string) => void;
}) => {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState('');
    const hasContent = focused || value.length > 0;

    useEffect(() => {
        if (setValueProp) {
            setValueProp(value);
        }
    }, [value, setValueProp]);

    useEffect(() => {
        if (setName) {
            setName(value);
        }
    }, [value, setName]);

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
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [organization, setOrganization] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      // Basic email validation
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailRegex.test(email)) {
          toast.error('Please enter a valid email address.');
          setLoading(false);
          return;
      }
  
      try {

          const signupsRef = collection(db, 'signups');
          const emailQuery = query(signupsRef, where('email', '==', email));
          const snapshot = await getDocs(emailQuery);
  
          if (!snapshot.empty) {
              toast.error('This email is already subscribed.');
              setLoading(false);
              return;
          }
  
          console.log('📝 Adding new document to Firestore with:', { name, email, organization });
          await addDoc(signupsRef, { name, email, organization });
          toast.success('Thank you for signing up!');
          setSubmitted(true);
      } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          toast.error(errorMsg);
      } finally {
          setLoading(false);
      }
  };

  
    return !submitted ? (
        <motion.div
            className={styles.formWrapper}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <h2 className={styles.title}>Sign Up for a Demo</h2>
            <form onSubmit={handleSignup} className={styles.form}>
                <FloatingLabelInput label="Name" setName={setName} />
                <FloatingLabelInput label="Organization" setValueProp={setOrganization} />
                <FloatingLabelInput label="Email" type="email" setValueProp={setEmail} />
                <button type="submit" disabled={loading} className={styles.button}>
                    {loading ? (
                        <ClipLoader color="#fff" size={15} />
                    ) : (
                        'Submit'
                    )}
                </button>
            </form>
        </motion.div>
    ) : (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={styles.textWrapper}
        >
            <h2 style={{ textWrap: 'balance' }} className={styles.title}>
                Congratulations {name}! You are on the list!
            </h2>
        </motion.div>
    );
};

export default Form;
