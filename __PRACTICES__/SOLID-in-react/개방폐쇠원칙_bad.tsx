// Open-Closed Principle (개방-폐쇄 원칙)
// 소프트웨어 요소는 확장에는 열려 있으나 변경에는 닫혀 있어야 한다

// Bad Example - 확장이 어려운 버튼 컴포넌트
const Button = ({ type }) => {
  if (type === 'primary') {
    return (
      <button style={{ background: 'blue', color: 'white' }}>Click me</button>
    );
  } else if (type === 'secondary') {
    return (
      <button style={{ background: 'gray', color: 'black' }}>Click me</button>
    );
  }
  return <button>Click me</button>;
};

// 새로운 스타일을 추가하려면?
// 1. 함수 내부를 수정해야 함
// 2. if문을 추가해야 함
// 3. 기존 코드를 수정할 위험이 있음 😱
