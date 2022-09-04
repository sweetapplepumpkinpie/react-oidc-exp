import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'

import { register } from '../../../services/api'
import { setAuthToken } from '../../../utils'

export const Register = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('This field is required'),
      password: Yup.string().required('This field is required'),
      confirm_password: Yup.string()
        .label('confirm password')
        .required('This field is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
    onSubmit: (values) => {
      register(values)
        .then(({ data: token }) => {
          setAuthToken(token)
          formik.resetForm()
        })
        .catch((error) => {
          const message = error.response?.data.detail

          formik.setFieldError('email', message)
        })
    },
  })
  return (
    <div>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <div>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email && <p>{formik.errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.errors.password && (
                <p color="tomato">{formik.errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="password">Password Confirmation</label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                variant="filled"
                onChange={formik.handleChange}
                value={formik.values.confirm_password}
              />
              {formik.errors.confirm_password && (
                <p>{formik.errors.confirm_password}</p>
              )}
            </div>
            <button type="submit">Register</button>
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
