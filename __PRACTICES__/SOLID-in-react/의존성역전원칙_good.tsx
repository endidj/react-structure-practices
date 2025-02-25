// Dependency Inversion Principle (의존성 역전 원칙)
// 고수준 모듈은 저수준 모듈에 의존하지 않아야 한다. 둘 다 추상화에 의존해야 한다

import { useEffect, useState } from 'react';

// GOOD 예시 - 추상화된 인터페이스 사용

// 1. 먼저 추상화된 인터페이스 정의
interface UserService {
  getUsers(): Promise<User[]>;
}

// 2. 실제 구현은 외부에서 주입
class ApiUserService implements UserService {
  getUsers() {
    return axios.get('/api/users');
  }
}

// 3. useUsers 커스텀 훅 구현
const useUsers = (userService: UserService) => {
  // users 상태와 로딩, 에러 상태도 관리
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [userService]);

  return { users, isLoading, error };
};

// 4. 컴포넌트는 추상화된 인터페이스만 알면 됨
const UserList_Good = ({ userService }) => {
  const users = useUsers(userService);
  return <ul>{/* ... */}</ul>;
};

// 왜 좋은가?

// 1. 추상화된 인터페이스를 사용하면 컴포넌트는 실제 구현에 대해 알 필요가 없음
// 유연하게 구현 변경이 가능함. 예를 들어 axios 대신 fetch로 변경하거나, GraphQL로 변경할 때도 컴포넌트 수정이 필요 없음

// axios 대신 fetch로 변경할 때
class FetchUserService implements UserService {
  getUsers() {
    return fetch('/api/users').then((res) => res.json());
  }
}

// GraphQL로 변경할 때
class GraphQLUserService implements UserService {
  getUsers() {
    return graphqlClient.query({ query: GET_USERS });
  }
}

// 컴포넌트는 전혀 수정할 필요 없음!
<UserList userService={new FetchUserService()} />;

// 2. 테스트하기 쉬움
// 추상화된 인터페이스를 사용하면 테스트용 Mock 서비스를 쉽게 만들 수 있음

// 테스트용 Mock 서비스 쉽게 생성
class MockUserService implements UserService {
  getUsers() {
    return Promise.resolve([{ id: 1, name: 'Test User' }]);
  }
}

test('UserList displays users correctly', () => {
  render(<UserList userService={new MockUserService()} />);
  // 테스트 로직...
});

// 3. 환경에 따라 다른 서비스 주입 가능
const userService =
  process.env.NODE_ENV === 'development'
    ? new MockUserService()
    : new ApiUserService();

// 4. 다양한 기능 추가하기 쉬움 (예: 캐싱이나 로깅)
class CachedUserService implements UserService {
  private cache: User[] | null = null;

  async getUsers() {
    if (this.cache) return this.cache;
    const users = await axios.get('/api/users');
    this.cache = users.data;
    return users.data;
  }
}

class LoggedUserService implements UserService {
  async getUsers() {
    console.log('Fetching users...');
    const users = await axios.get('/api/users');
    console.log('Fetched users:', users.data);
    return users.data;
  }
}

// 5. 다른 API 엔드포인트 사용하기 쉬움
class OtherApiUserService implements UserService {
  getUsers() {
    return axios.get('https://other-api.com/users');
  }
}

// 컴포넌트는 그대로 재사용
<UserList userService={new OtherApiUserService()} />;
