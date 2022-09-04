import { useFormik } from 'formik'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

import { AuthContext } from '../../../contexts/auth'
import { login } from '../../../services/api'

export const Login = () => {
  const authContext = useContext(AuthContext)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('This field is required'),
      password: Yup.string().required('This field is required'),
    }),
    onSubmit: (values) => {
      login(values)
        .then(({ data: token }) => {
          formik.resetForm()
          authContext?.setLocalStorageToken(token)
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
          <div spacing={4} align="flex-start">
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
              {formik.errors.email && (
                <p color="tomato">{formik.errors.email}</p>
              )}
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
            <button type="submit">Login</button>
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
