import { useEffect } from "react";
import { useMeQuery } from "../features/auth/authApi";
import {
  clearCredentials,
  setAuthChecked,
  setCredentials,
} from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();
  const { data, isSuccess, isError, isLoading } = useMeQuery();

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(setCredentials(data.user));
    }

    if (isError) {
      dispatch(clearCredentials());
    }

    if (!isLoading) {
      dispatch(setAuthChecked());
    }
  }, [data, isSuccess, isError, isLoading, dispatch]);

  return children;
};

export default AuthBootstrap;