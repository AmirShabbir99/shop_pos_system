import { useEffect } from "react";
import { useMeQuery } from "../features/auth/authApi";
import {
  setAuthChecked,
  setCredentials,
} from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  const { data, isSuccess } = useMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    
    if (isSuccess && data?.user) {
      dispatch(setCredentials(data.user));
    }

    dispatch(setAuthChecked());
  }, [isSuccess, data, dispatch]);

  return children;
};

export default AuthBootstrap;