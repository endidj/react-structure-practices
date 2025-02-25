# React와 SOLID 원칙 가이드

이 가이드는 React 개발에서 SOLID 원칙을 어떻게 적용할 수 있는지 설명합니다.

## 목차

- [SOLID 원칙이란?](#solid-원칙이란)
- [단일 책임 원칙 (SRP)](#단일-책임-원칙-srp)
- [개방-폐쇄 원칙 (OCP)](#개방-폐쇄-원칙-ocp)
- [리스코프 치환 원칙 (LSP)](#리스코프-치환-원칙-lsp)
- [인터페이스 분리 원칙 (ISP)](#인터페이스-분리-원칙-isp)
- [의존성 역전 원칙 (DIP)](#의존성-역전-원칙-dip)
- [적용 효과](#적용-효과)

## SOLID 원칙이란?

SOLID는 객체 지향 프로그래밍의 다섯 가지 기본 원칙을 마이클 페더스가 소개한 것으로, 각 원칙의 앞글자를 따서 만든 단어입니다.

## 단일 책임 원칙 (SRP)

> "한 클래스(컴포넌트)는 하나의 책임만 가져야 한다"

**Bad Practice 🚫**

```tsx
const UserProfile = () => {
  // 데이터 fetch, 상태 관리, UI 표시 등 여러 책임을 가짐
  // ... 많은 코드
};
```

**Good Practice ✅**

```tsx
// 데이터 관련 로직
const useUser = () => {
  // ... 데이터 fetch 로직
};

// UI 표시 전용 컴포넌트
const UserDisplay = ({ user }) => {
  // ... UI 관련 로직
};

// 조합하는 컴포넌트
const UserProfile = () => {
  const { user } = useUser();
  return <UserDisplay user={user} />;
};
```

## 개방-폐쇄 원칙 (OCP)

> "소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다"

**Bad Practice 🚫**

```tsx
const Button = ({ type }) => {
  if (type === 'primary') {
    /* ... */
  } else if (type === 'secondary') {
    /* ... */
  }
  // 새로운 타입 추가 시 코드 수정 필요
};
```

**Good Practice ✅**

```tsx
const Button = ({ variant = 'default', children, ...props }) => {
  const styles = {
    default: {},
    primary: {
      /* ... */
    },
    secondary: {
      /* ... */
    },
    // 새로운 스타일 추가가 용이함
  };

  return (
    <button style={styles[variant]} {...props}>
      {children}
    </button>
  );
};
```

## 리스코프 치환 원칙 (LSP)

> "하위 타입은 상위 타입을 대체할 수 있어야 한다"

**Bad Practice 🚫**

```tsx
class Animal extends React.Component {
  makeSound() {
    return 'Some sound';
  }
}

class Cat extends Animal {
  makeSound() {
    throw new Error(); // 부모의 동작을 깨트림
  }
}
```

**Good Practice ✅**

```tsx
interface SoundMaker {
  makeSound(): string;
}

const Animal: React.FC<SoundMaker> = ({ makeSound }) => {
  return <div>{makeSound()}</div>;
};

const Cat = () => <Animal makeSound={() => 'Meow'} />;
```

## 인터페이스 분리 원칙 (ISP)

> "클라이언트는 자신이 사용하지 않는 인터페이스에 의존하지 않아야 한다"

**Bad Practice 🚫**

```tsx
type UserProps = {
  name: string;
  email: string;
  address: string;
  phone: string;
  // ... 더 많은 속성들
};
```

**Good Practice ✅**

```tsx
type UserBasicInfo = {
  name: string;
  email: string;
};

type UserContactInfo = {
  address: string;
  phone: string;
};
```

## 의존성 역전 원칙 (DIP)

> "고수준 모듈은 저수준 모듈에 의존하지 않아야 한다. 둘 다 추상화에 의존해야 한다"

**Bad Practice 🚫**

```tsx
const UserList = () => {
  useEffect(() => {
    axios.get('/api/users')... // 구체적인 구현에 직접 의존
  }, []);
};
```

**Good Practice ✅**

```tsx
interface UserService {
  getUsers(): Promise<User[]>;
}

const UserList = ({ userService }: { userService: UserService }) => {
  // 추상화된 인터페이스에 의존
};
```

## 적용 효과

SOLID 원칙을 React 프로젝트에 적용하면 다음과 같은 이점이 있습니다:

✨ 코드 재사용성 향상  
🧪 테스트 용이성 증가  
🔧 유지보수 편의성 향상  
📈 확장성 개선  
🎯 코드 복잡도 감소

---

이 가이드가 React 개발에 SOLID 원칙을 적용하는 데 도움이 되기를 바랍니다! 🚀
