import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import { ToastContainer } from 'react-toastify';
import Items from './pages/Expense/ExpenseItems';
import FixedDaily from './pages/FixedDaily';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {

    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const loggedIn = localStorage.getItem('logged_in') === 'true';
        setIsAuthenticated(loggedIn);
        setLoading(false);
        if (!loggedIn) {
          navigate('/auth/signin');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setLoading(false);
        navigate('/auth/signin');
      }
    };

    authenticate();
  }, [navigate]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Routes>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <SignUp />
            </>
          }
        />
        {/* All other routes use the DefaultLayout */}
        {isAuthenticated && (

          <Route
            path="*"
            element={
              <DefaultLayout>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <ECommerce />
                      </>
                    }
                  />
                  <Route
                    path="/calendar"
                    element={
                      <>
                        <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Calendar />
                      </>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <>
                        <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Profile />
                      </>
                    }
                  />

                  <Route
                    path="/expense/expense-items/*"
                    element={
                      <>
                        <PageTitle title="Expense Items | Expense Tracker" />
                        <Items />
                      </>
                    }
                  />

                  <Route
                    path="/expense/fixed-daily/*"
                    element={
                      <>
                        <PageTitle title="Expense Daily | Expense Tracker" />
                        <FixedDaily />
                      </>
                    }
                  />
                  <Route
                    path="/forms/form-elements"
                    element={
                      <>
                        <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <FormElements />
                      </>
                    }
                  />
                  <Route
                    path="/forms/form-layout"
                    element={
                      <>
                        <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <FormLayout />
                      </>
                    }
                  />
                  <Route
                    path="/tables"
                    element={
                      <>
                        <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Tables />
                      </>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <>
                        <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Settings />
                      </>
                    }
                  />
                  <Route
                    path="/chart"
                    element={
                      <>
                        <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Chart />
                      </>
                    }
                  />
                  <Route
                    path="/ui/alerts"
                    element={
                      <>
                        <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Alerts />
                      </>
                    }
                  />
                  <Route
                    path="/ui/buttons"
                    element={
                      <>
                        <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                        <Buttons />
                      </>
                    }
                  />
                </Routes>
              </DefaultLayout>
            }
          />

        )}
      </Routes>
      <ToastContainer />
    </div>

  );
}

export default App;
