// Liskov Substitution Principle (리스코프 치환 원칙)
//하위 타입은 상위 타입을 대체할 수 있어야 한다

import React from 'react';

// 상속을 사용한 잘못된 예시
class Animal extends React.Component {
  makeSound() {
    return 'Some sound';
  }

  render() {
    return <div>{this.makeSound()}</div>;
  }
}

class Cat extends Animal {
  makeSound(): string {
    // 부모 클래스의 동작을 예측할 수 없게 만듦
    throw new Error("Cat can't make sound");
  }
}

class Dog extends Animal {
  // 부모 메서드의 반환 타입과 다른 타입을 반환
  makeSound(): number {
    return 123; // 타입 계약 위반!
  }
}
