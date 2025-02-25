// Open-Closed Principle (개방-폐쇄 원칙)
// 소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다

// Good Example - 확장 가능한 버튼 컴포넌트
// 1. 타입 정의
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

// 2. 스타일을 객체로 분리
const buttonStyles = {
  default: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  primary: {
    background: 'blue',
    color: 'white',
    border: 'none',
  },
  secondary: {
    background: 'gray',
    color: 'black',
    border: 'none',
  },
  // 새로운 스타일 추가가 쉬움
  danger: {
    background: 'red',
    color: 'white',
    border: 'none',
  },
  success: {
    background: 'green',
    color: 'white',
    border: 'none',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  small: { padding: '4px 8px', fontSize: '12px' },
  medium: { padding: '8px 16px', fontSize: '14px' },
  large: { padding: '12px 24px', fontSize: '16px' },
};

// 3. 향상된 버튼 컴포넌트
const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'medium',
  isLoading = false,
  children,
  className,
  ...props
}) => {
  const combinedStyles = {
    ...buttonStyles[variant],
    ...sizeStyles[size],
  };

  return (
    <button
      style={combinedStyles}
      className={`button ${className || ''}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  );
};

// 장점

// 1. 확장성이 좋음
// 새로운 스타일 추가가 쉬움
buttonStyles.ghost = {
  background: 'transparent',
  color: 'inherit',
};

// 2. 재사용성 좋음
// 다양한 상황에서 재사용 가능
const SubmitButton = () => (
  <Button variant="primary" type="submit" isLoading={isSubmitting}>
    제출하기
  </Button>
);

// 3. 유지보수성
// 스타일 수정이 한 곳에서 가능
buttonStyles.primary = {
  ...buttonStyles.primary,
  borderRadius: '8px', // 모든 primary 버튼의 스타일 업데이트
};

// 4. 테스트 용이성
test('renders button with correct variant', () => {
  render(<Button variant="primary">Test</Button>);
  expect(screen.getByRole('button')).toHaveStyle(buttonStyles.primary);
});
