// Interface Segregation Principle (인터페이스 분리 원칙)

// Bad Example - 한 인터페이스에 모든 속성을 몰아넣은 경우
type UserProps = {
  name: string;
  email: string;
  address: string;
  phone: string;
  preferences: object;
  socialMedia: object;
  paymentInfo: object;
};

const UserProfile: React.FC<UserProps> = (props) => {
  // ...
};

// 사용할 때 모든 props를 전달해야 함 😱
<UserProfile
  name="John"
  email="john@example.com"
  address="123 Street"
  phone="123-456-7890"
  preferences={{}}
  socialMedia={{}}
  paymentInfo={{}}
/>;
