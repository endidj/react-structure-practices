// Single Responsibility Principle (단일 책임 원칙)
// 한 클래스(컴포넌트)는 하나의 책임만 가져야 한다
import { useEffect, useState } from 'react';

// 1. 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// 2. API 서비스 인터페이스 정의
interface UserApiServiceInterface {
  fetchUser(): Promise<User>;
  updateUser(data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

// 3. 실제 API 서비스 구현
class UserApiService implements UserApiServiceInterface {
  private baseUrl: string;
  private axios: AxiosInstance;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async fetchUser(): Promise<User> {
    try {
      const { data } = await this.axios.get<User>('/user');
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    try {
      const { data } = await this.axios.put<User>('/user', userData);
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.axios.delete(`/user/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(
        error.response?.data?.message || '서버 에러가 발생했습니다'
      );
    }
    return new Error('알 수 없는 에러가 발생했습니다');
  }
}

// 4. Mock 서비스 (테스트용)
class MockUserApiService implements UserApiServiceInterface {
  private mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'test-avatar.jpg',
  };

  async fetchUser(): Promise<User> {
    return Promise.resolve(this.mockUser);
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    this.mockUser = { ...this.mockUser, ...userData };
    return Promise.resolve(this.mockUser);
  }

  async deleteUser(): Promise<void> {
    return Promise.resolve();
  }
}

// 5. 커스텀 훅에서 서비스 사용
const useUser = (userService: UserApiServiceInterface) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await userService.fetchUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '에러가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await userService.updateUser(userData);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : '업데이트 실패');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, updateUser };
};

// 6. 서비스 인스턴스 생성
const userApiService = new UserApiService();

// 7. 컴포넌트에서 사용
const UserProfile = ({ userService }) => {
  const { user, loading, error, updateUser } = useUser(userService);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return null;

  return (
    <div>
      <UserInfo user={user} />
      <UserUpdateForm user={user} onSubmit={updateUser} />
    </div>
  );
};

// 사용예시
// app.tsx
const App = () => {
  const userService = new UserApiService('/api/v1');

  return (
    <div>
      <UserProfile userService={userService} />
    </div>
  );
};

// 테스트환경
// UserProfile.test.tsx
describe('UserProfile', () => {
  const mockService = new MockUserApiService();

  it('renders user data correctly', async () => {
    render(<UserProfile userService={mockService} />);
    // 테스트 로직...
  });
});

// 장점들
// 1. 의존성 주입
// 다양한 환경에서 다른 구현체 사용 가능 (테스트, 개발, 프로덕션)
const UserProfile = ({
  userService,
}: {
  userService: UserApiServiceInterface;
}) => {
  // ...
};

// 2. 에러처리 통합 관리
// 모든 API 호출의 에러 처리를 한 곳에서 관리
class UserApiService {
  private handleError(error: any): Error {
    // 모든 API 호출의 에러 처리를 한 곳에서 관리
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // 인증 에러 처리
        auth.logout();
      }
      // ... 다른 에러 처리
    }
    return new Error('알 수 없는 에러가 발생했습니다');
  }
}

// 3. 인터셉터 추가
// 예: 모든 API 호출에 공통 헤더 추가
class UserApiService {
  constructor() {
    this.axios.interceptors.request.use((config) => {
      // 토큰 추가
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
}

// 4. 캐싱 추가
class CachedUserApiService implements UserApiServiceInterface {
  private cache: Map<string, User> = new Map();

  async fetchUser(): Promise<User> {
    if (this.cache.has('user')) {
      return this.cache.get('user')!;
    }
    const user = await userApiService.fetchUser();
    this.cache.set('user', user);
    return user;
  }
}
