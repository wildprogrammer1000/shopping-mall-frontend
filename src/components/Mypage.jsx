import React, { useEffect, useState } from 'react';
import { requestFetch } from '../utils/fetch';
import { Link } from "react-router-dom";
import { PATH } from "../constants/path";
import { useUser } from '../store/context';

const MyPage = () => {
  const [user, setUser] = useUser();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await requestFetch('/user/session');
        if (!response) {
          alert('로그인이 필요합니다.');
          window.location.href = '/login';
          return
        }
        setUser(response);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  if (!user) return <div>로딩중...</div>;

  return (
    <div>
      <Link to={PATH.ROOT}>쇼핑몰</Link>

      <h2>마이페이지</h2>
      <div>이메일: {user.email}</div>
      <div>닉네임: {user.nickname}</div>
    </div>
  );
};

export default MyPage;