import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../components/header/Header';
import styles from '../styles/account.module.css';
import Image from 'next/image';
import visible from '../public/visible.svg';
import invisible from '../public/invisible.svg';
import ErrorInfoIcon from '../public/errorinfo.svg';
import Link from 'next/link';
import axios from 'axios';
import { Context } from '../context/context';
import { useRouter } from 'next/router';

const Account = () => {
  const [initialState, setInitialState] = useState(false);
  const router = useRouter();

  useEffect(() => {
    /***
     * Handle signin and create account elements rendering on clicks
     */
    const signIn = document.getElementById('sign-in') as HTMLDivElement;
    const createAccount = document.getElementById(
      'create-account',
    ) as HTMLDivElement;
    const signupForm = document.getElementById(
      'sign-up-form',
    ) as HTMLDivElement;
    const signinForm = document.getElementById(
      'sign-in-form',
    ) as HTMLDivElement;

    signIn.addEventListener('click', () => {
      signinForm.style.display = 'block';
      signupForm.style.display = 'none';
      signIn.style.backgroundColor = 'transparent';
      signIn.style.color = '#396afc';
      signIn.style.borderTop = '2px solid #396afc';
      createAccount.style.backgroundColor = 'hsla(210, 5%, 98%, 1)';
      createAccount.style.borderTop = '2px solid #b9b9b9';
    });

    createAccount.addEventListener('click', () => {
      signupForm.style.display = 'block';
      signinForm.style.display = 'none';
      createAccount.style.backgroundColor = 'transparent';
      createAccount.style.color = '#396afc';
      createAccount.style.borderTop = '2px solid #396afc';
      signIn.style.backgroundColor = 'hsla(210, 5%, 98%, 1)';
      signIn.style.borderTop = '2px solid #b9b9b9';
    });

    /***
     * Validate Email pattern,
     * Check password strength, and
     * Check if password and confirm password match on client side only
     * during account creation.
     */

    // Sign in
    const signinEmail = document.querySelector(
      "[data-target='email-input']",
    ) as HTMLInputElement;
    const signinPassword = document.querySelector(
      "[data-target='password']",
    ) as HTMLInputElement;
    const inputError = document.querySelector(
      '#input-error',
    ) as HTMLSpanElement;
    const signInSubmitButton = document.querySelector(
      '#signin-submit',
    ) as HTMLButtonElement;
    const signinAlertBox = document.getElementById(
      'alert-box-1',
    ) as HTMLDivElement;

    // Create account
    const firstNameInput = document.getElementById(
      'firstname-input',
    ) as HTMLInputElement;
    const lastNameInput = document.getElementById(
      'lastname-input',
    ) as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const confirmPassword = document.getElementById(
      'confirm-password',
    ) as HTMLInputElement;
    const emailElement = document.querySelector(
      '#email-input',
    ) as HTMLInputElement;
    const errorInfo = document.getElementById('error-info') as HTMLSpanElement;
    const createSubmitButton = document.getElementById(
      'create-submit',
    ) as HTMLButtonElement;
    const createAccountAlertBox = document.getElementById(
      'alert-box-2',
    ) as HTMLDivElement;

    const sanitizeNameInput = () => {
      let strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.{3,})');
      if (
        (firstNameInput.value !== '' &&
          !firstNameInput.value.match(strongRegex)) ||
        (lastNameInput.value !== '' && !lastNameInput.value.match(strongRegex))
      ) {
        errorInfo.textContent = 'Please enter a valid name';
        createAccountAlertBox.style.display = 'flex';
        createSubmitButton.disabled = true;
        createSubmitButton.style.cursor = 'not-allowed';
      } else {
        createAccountAlertBox.style.display = 'none';
        createSubmitButton.disabled = false;
        createSubmitButton.style.cursor = 'pointer';
      }
    };

    const validateEmail = () => {
      let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (
        (signinEmail.value !== '' && !signinEmail.value.match(pattern)) ||
        (emailElement.value !== '' && !emailElement.value.match(pattern))
      ) {
        signInSubmitButton.disabled = true;
        signInSubmitButton.style.cursor = 'not-allowed';
        createSubmitButton.disabled = true;
        createSubmitButton.style.cursor = 'not-allowed';
        inputError.textContent = 'invalid email pattern';
        errorInfo.textContent = 'invalid email pattern';
        signinAlertBox.style.display = 'flex';
        createAccountAlertBox.style.display = 'flex';
        signinEmail.focus();
        emailElement.focus();
        return false;
      } else {
        signInSubmitButton.disabled = false;
        signInSubmitButton.style.cursor = 'pointer';
        createSubmitButton.disabled = false;
        createSubmitButton.style.cursor = 'pointer';
        signinAlertBox.style.display = 'none';
        createAccountAlertBox.style.display = 'none';
        return true;
      }
    };

    const checkPasswordStrength = () => {
      let strongRegex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
      );
      if (
        (signinPassword.value !== '' &&
          !signinPassword.value.match(strongRegex)) ||
        (password.value !== '' && !password.value.match(strongRegex))
      ) {
        signInSubmitButton.disabled = true;
        signInSubmitButton.style.cursor = 'not-allowed';
        createSubmitButton.disabled = true;
        createSubmitButton.style.cursor = 'not-allowed';
        inputError.textContent =
          'password must contain at least one uppercase, a lowercase, number, a special character, and must be 8 characters long or more.';
        errorInfo.textContent =
          'password must contain at least one uppercase, a lowercase, number, a special character, and must be 8 characters long or more.';
        signinAlertBox.style.display = 'flex';
        createAccountAlertBox.style.display = 'flex';
      } else if (
        password.value !== '' &&
        password.value.match(strongRegex) &&
        confirmPassword.value !== '' &&
        password.value !== confirmPassword.value
      ) {
        createSubmitButton.disabled = true;
        createSubmitButton.style.cursor = 'not-allowed';
        errorInfo.textContent = 'password not matching';
        signinAlertBox.style.display = 'flex';
        createAccountAlertBox.style.display = 'flex';
      } else {
        signInSubmitButton.disabled = false;
        signInSubmitButton.style.cursor = 'pointer';
        createSubmitButton.disabled = false;
        createSubmitButton.style.cursor = 'pointer';
        signinAlertBox.style.display = 'none';
        createAccountAlertBox.style.display = 'none';
      }
    };
    firstNameInput.addEventListener('keyup', sanitizeNameInput);
    lastNameInput.addEventListener('keyup', sanitizeNameInput);
    // signinEmail.addEventListener('keyup', validateEmail);
    // signinPassword.addEventListener('keyup', checkPasswordStrength);
    emailElement.addEventListener('keyup', validateEmail);
    password.addEventListener('keyup', checkPasswordStrength);
    confirmPassword.addEventListener('keyup', checkPasswordStrength);

    /***
     * Password visibility check on client side only
     */
    const eyeIcon = document.getElementById('eye-icon') as HTMLImageElement;
    const eyeIcon2 = document.getElementById('eye-icon2') as HTMLImageElement;
    const eyeIcon3 = document.getElementById('eye-icon3') as HTMLImageElement;

    const handleEyeIcon = () => {
      if (!initialState) {
        setInitialState(true);
        signinPassword.type = 'text';
        eyeIcon.src = invisible.src;
        eyeIcon.srcset = invisible.src;
      } else {
        setInitialState(false);
        signinPassword.type = 'password';
        eyeIcon.src = visible.src;
        eyeIcon.srcset = visible.src;
      }
    };

    const handleEyeIcon2 = () => {
      if (!initialState) {
        setInitialState(true);
        password.type = 'text';
        eyeIcon2.src = invisible.src;
        eyeIcon2.srcset = invisible.src;
      } else {
        setInitialState(false);
        password.type = 'password';
        eyeIcon2.src = visible.src;
        eyeIcon2.srcset = visible.src;
      }
    };

    const handleEyeIcon3 = () => {
      if (!initialState) {
        setInitialState(true);
        confirmPassword.type = 'text';
        eyeIcon3.src = invisible.src;
        eyeIcon3.srcset = invisible.src;
      } else {
        setInitialState(false);
        confirmPassword.type = 'password';
        eyeIcon3.src = visible.src;
        eyeIcon3.srcset = visible.src;
      }
    };

    eyeIcon.addEventListener('click', handleEyeIcon);
    eyeIcon2.addEventListener('click', handleEyeIcon2);
    eyeIcon3.addEventListener('click', handleEyeIcon3);
    return () => {
      eyeIcon.removeEventListener('click', handleEyeIcon);
      eyeIcon2.removeEventListener('click', handleEyeIcon2);
      eyeIcon3.removeEventListener('click', handleEyeIcon3);
    };
  }, [initialState]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [catchedError, setCatchedError] = useState('');

  const { dispatch, isFetching, user }: any = useContext(Context);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSignin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await axios.post(`${process.env.API_URI}/auth/login`, {
        email: emailRef.current!.value,
        password: passwordRef.current!.value,
      });
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      router.push('/dashboard');
    } catch (err: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      setError(err.response.data);
    }
  };

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.API_URI}/auth/register`, {
        email,
        password,
        firstname: firstNameRef.current!.value,
        lastname: lastNameRef.current!.value,
      });
      window.location.reload();
    } catch (err: any) {
      let email = err.response.data.keyValue.email;
      if (email) {
        setCatchedError(`User with email - ${email} already exists`);
      } else {
        setCatchedError(
          'Some internal server error occurred. You may contact the admin if error persists',
        );
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerDiv}>
        <Header />
      </div>
      <div className={styles.parent}>
        <div className={styles.wrapper}>
          <div className={styles.accountOptions}>
            <div className={styles.signInOption} id="sign-in">
              <span>Sign In</span>
            </div>

            <div className={styles.signUpOption} id="create-account">
              <span>Create Account</span>
            </div>
          </div>
          <form
            className={styles.signin}
            id="sign-in-form"
            onSubmit={handleSignin}>
            <label className={styles.label}>Sign in to your account</label>
            <div className={styles.formWrapper}>
              <div>
                <input
                  className={styles.textBox}
                  data-target="email-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  ref={emailRef}
                />
              </div>
              <div>
                <div className={styles.passContainer}>
                  <input
                    className={styles.passBox}
                    data-target="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    ref={passwordRef}
                  />
                  <span className={styles.visibility}>
                    <Image
                      src={visible}
                      id="eye-icon"
                      height={25}
                      alt="see password as you type"
                      priority
                    />
                  </span>
                </div>
                <div className={styles.alertErrorBox__1} id="alert-box-1">
                  <span>
                    <Image
                      src={ErrorInfoIcon}
                      width={20}
                      height={20}
                      layout="fixed"
                      alt=""
                    />
                  </span>
                  <span id="input-error"></span>
                </div>
                {error && (
                  <div className={styles.alertErrorBox__2}>
                    <span>
                      <Image
                        src={ErrorInfoIcon}
                        width={20}
                        height={20}
                        layout="fixed"
                        alt=""
                      />
                    </span>
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <button
                className={styles.action}
                id="signin-submit"
                type="submit"
                disabled={isFetching}>
                Sign in
              </button>
            </div>
            <Link href="/account">
              <a>
                <p className={styles.recoverKey}>Forgot your password?</p>
              </a>
            </Link>
          </form>

          <form
            className={styles.signup}
            id="sign-up-form"
            name="signupform"
            onSubmit={handleRegister}>
            <label className={styles.label}>Create a new account</label>
            <div className={styles.formWrapper}>
              <div>
                <input
                  className={styles.textBox}
                  type="text"
                  id="firstname-input"
                  name="firstname"
                  placeholder="First Name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  ref={firstNameRef}
                />
              </div>
              <div>
                <input
                  className={styles.textBox}
                  type="test"
                  id="lastname-input"
                  name="lastname"
                  placeholder="Last Name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  ref={lastNameRef}
                />
              </div>
              <div>
                <input
                  className={styles.textBox}
                  type="email"
                  id="email-input"
                  name="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.passContainer}>
                <input
                  className={styles.passBox}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className={styles.visibility}>
                  <Image
                    src={visible}
                    id="eye-icon2"
                    height={25}
                    alt="see password as you type"
                    priority
                  />
                </span>
              </div>
              <div>
                <div className={styles.passContainer}>
                  <input
                    className={styles.passBox}
                    type="password"
                    name="password"
                    id="confirm-password"
                    placeholder="Confirm Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className={styles.visibility}>
                    <Image
                      src={visible}
                      id="eye-icon3"
                      height={25}
                      alt="see password as you type"
                      priority
                    />
                  </span>
                </div>
                <div className={styles.alertErrorBox__1} id="alert-box-2">
                  <span>
                    <Image
                      src={ErrorInfoIcon}
                      width={20}
                      height={20}
                      layout="fixed"
                      alt=""
                    />
                  </span>
                  <span id="error-info"></span>
                </div>
                {catchedError && (
                  <div className={styles.alertErrorBox__2}>
                    <span>
                      <Image
                        src={ErrorInfoIcon}
                        width={20}
                        height={20}
                        layout="fixed"
                        alt=""
                      />
                    </span>
                    <span>{catchedError}</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className={styles.action}
                id="create-submit">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
