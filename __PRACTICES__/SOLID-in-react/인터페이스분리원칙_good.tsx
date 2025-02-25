// 1. 명확한 책임을 가진 작은 인터페이스들
type UserBasicInfo = {
  name: string;
  email: string;
};

type UserContactInfo = {
  address: string;
  phone: string;
};

type UserPreferences = {
  theme: 'light' | 'dark';
  notifications: boolean;
};

type UserSocialMedia = {
  twitter?: string;
  linkedin?: string;
};

// 2. 각각의 책임에 맞는 컴포넌트들
const UserBasicProfile: React.FC<UserBasicInfo> = ({ name, email }) => (
  <div className="basic-info">
    <h2>Basic Information</h2>
    <p>Name: {name}</p>
    <p>Email: {email}</p>
  </div>
);

const UserContactProfile: React.FC<UserContactInfo> = ({ address, phone }) => (
  <div className="contact-info">
    <h2>Contact Information</h2>
    <p>Address: {address}</p>
    <p>Phone: {phone}</p>
  </div>
);

// 3. 필요한 부분만 조합해서 사용
const UserDashboard = () => (
  <div>
    <UserBasicProfile name="John" email="john@example.com" />
    {/* 필요한 경우에만 연락처 정보 표시 */}
    <UserContactProfile address="123 Street" phone="123-456-7890" />
  </div>
);

// 이렇게 했을때 장점들

// 1. 재사용성 향상
// 다른 페이지에서 기본 정보만 필요한 경우
const UserList = ({ users }: { users: UserBasicInfo[] }) => (
  <div>
    {users.map((user) => (
      <UserBasicProfile key={user.email} {...user} />
    ))}
  </div>
);

// 2. 조건부 렌더링이 쉬워짐
const UserProfile = ({ user, showContact = false }) => (
  <div>
    <UserBasicProfile {...user} />
    {showContact && <UserContactProfile {...user} />}
  </div>
);

// 3. 테스트가 더 쉬워짐
test('UserBasicProfile renders correctly', () => {
  const basicInfo = {
    name: 'John',
    email: 'john@example.com',
  };

  render(<UserBasicProfile {...basicInfo} />);
  // 더 적은 props로 간단한 테스트 가능
});

// 4. 성능 최적화 용이
// 필요한 데이터만 메모이제이션
const MemoizedBasicProfile = React.memo(UserBasicProfile);
const MemoizedContactProfile = React.memo(UserContactProfile);

// 5. lazy loading 쉬움
const UserPaymentInfo = React.lazy(() => import('./UserPaymentInfo'));

const UserProfile = () => (
  <div>
    <UserBasicProfile {...basicInfo} />
    <Suspense fallback={<Loading />}>
      <UserPaymentInfo {...paymentInfo} />
    </Suspense>
  </div>
);

// 6. 유지보수성 향상
// 각 섹션별로 독립적인 업데이트 가능
const UserContactProfile: React.FC<UserContactInfo> = ({ address, phone }) => {
  const handleAddressUpdate = () => {
    /* ... */
  };

  return (
    <div>
      <input value={address} onChange={handleAddressUpdate} />
      {/* 다른 섹션의 로직에 영향 없이 수정 가능 */}
    </div>
  );
};
