// Single Responsibility Principle (단일 책임 원칙)
// 한 클래스(컴포넌트)는 하나의 책임만 가져야 한다
import { useEffect, useState } from 'react';

// Bad Example - 여러 책임을 가진 컴포넌트
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/user');
      setUser(response.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleUpdateUser = async (data) => {
    try {
      await axios.put('/api/user', data);
      fetchUserData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <UserForm onSubmit={handleUpdateUser} />
    </div>
  );
};

// 하나의 컴포넌트가 너무 많은 일을 하고 있음
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 데이터 페칭 로직
  // 상태 관리 로직
  // 에러 처리 로직
  // UI 렌더링 로직
  // 폼 처리 로직
  // 전부 한 컴포넌트에서 처리 😱
};
