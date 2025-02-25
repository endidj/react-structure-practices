import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API 응답 타입
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

// API 에러 타입
class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 기본 API 서비스 클래스
// 일반 클래스 대신 추상 클래스를 선택한 이유 ?
// 1. 직접 인스턴스화 방지 : const apiService = new ApiService(); // ❌ 에러!
// 2. 상속해서 쓰라는 명확한 의도 전달 : ApiService는 그 자체로는 불완전한 베이스 클래스임을 명시적으로 나타냄
//   이는 다른 개발자들에게 "이 클래스는 상속해서 사용하도록 설계되었다"는 의도를 전달함
// 3. 아키텍처 강제 : 모든 API 서비스는 반드시 ApiService를 상속받아야 합니다
// 4. 만약 일반 클래스로 만들었다면 : const api = new ApiService('https://api.example.com'); 이렇게 바로 사용하는 경우가 생김..
abstract class ApiService {
  protected axios: AxiosInstance;
  protected baseURL: string;

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.baseURL = baseURL;
    this.axios = axios.create({
      baseURL,
      timeout: 30000, // 30초
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    });

    this.setupInterceptors();
  }

  // 인터셉터 설정
  private setupInterceptors(): void {
    // 요청 인터셉터
    this.axios.interceptors.request.use(
      (config) => {
        // 토큰이 필요한 경우 여기서 추가
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터
    this.axios.interceptors.response.use(
      (response) => this.handleResponse(response),
      (error) => this.handleError(error)
    );
  }

  // 응답 처리
  protected handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    };
  }

  // 에러 처리
  protected handleError(error: any): never {
    if (error.response) {
      throw new ApiError(
        error.response.status,
        error.response.data.message || 'Server Error',
        error.response.data
      );
    }
    throw new ApiError(500, error.message || 'Network Error');
  }

  // HTTP 메서드들
  protected async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.get<T>(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.post<T>(url, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.put<T>(url, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axios.delete<T>(url, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

// 사용 예시: 특정 서버의 API 서비스
class UserApiService extends ApiService {
  constructor() {
    super('https://api.example.com/users');
  }

  // 사용자 목록 조회
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>('/');
  }

  // 특정 사용자 조회
  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/${id}`);
  }

  // 사용자 생성
  async createUser(userData: CreateUserDTO): Promise<ApiResponse<User>> {
    return this.post<User>('/', userData);
  }

  // 사용자 수정
  async updateUser(
    id: string,
    userData: UpdateUserDTO
  ): Promise<ApiResponse<User>> {
    return this.put<User>(`/${id}`, userData);
  }

  // 사용자 삭제
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/${id}`);
  }
}

// 사용 예시: 다른 서버의 API 서비스
class ProductApiService extends ApiService {
  constructor() {
    super('https://api.example.com/products');
  }

  // 제품 관련 메서드들...
}

// 사용 방법
const userApi = new UserApiService();
const productApi = new ProductApiService();

// React 컴포넌트에서 사용 예시
const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getUsers();
        setUsers(response.data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        }
      }
    };

    fetchUsers();
  }, []);

  // ... 렌더링 로직
};
