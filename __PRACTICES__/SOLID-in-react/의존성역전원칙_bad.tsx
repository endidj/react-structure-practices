// Dependency Inversion Principle (의존성 역전 원칙)
// 고수준 모듈은 저수준 모듈에 의존하지 않아야 한다. 둘 다 추상화에 의존해야 한다

import { useEffect, useState } from 'react';

// BAD 예시 - 고수준 모듈이 저수준 모듈(axios)에 직접 의존
const UserList_Bad = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // axios에 직접 의존 - 나중에 fetch나 다른 방식으로 바꾸기 어려움
    axios.get('/api/users').then((response) => setUsers(response.data));
  }, []);

  return <ul>{/* ... */}</ul>;
};
