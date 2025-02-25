// Liskov Substitution Principle (리스코프 치환 원칙)
//하위 타입은 상위 타입을 대체할 수 있어야 한다

import React from 'react';

// 1. 명확한 인터페이스 정의
interface SoundMaker {
  makeSound(): string;
  volume?: number;
}

interface AnimalProps extends SoundMaker {
  name: string;
  type: 'mammal' | 'bird' | 'reptile';
}

// 2. 기본 동물 컴포넌트
const Animal: React.FC<AnimalProps> = ({
  makeSound,
  name,
  type,
  volume = 1,
}) => {
  return (
    <div className="animal">
      <h3>{name}</h3>
      <p>Type: {type}</p>
      <p>Sound: {makeSound()}</p>
      <p>Volume: {volume}</p>
    </div>
  );
};

// 3. 구체적인 동물 컴포넌트들
const Cat: React.FC<Omit<AnimalProps, 'makeSound' | 'type'>> = ({
  name,
  ...props
}) => {
  return (
    <Animal name={name} type="mammal" makeSound={() => 'Meow'} {...props} />
  );
};

const Dog: React.FC<Omit<AnimalProps, 'makeSound' | 'type'>> = ({
  name,
  ...props
}) => {
  return (
    <Animal name={name} type="mammal" makeSound={() => 'Woof'} {...props} />
  );
};

const Bird: React.FC<Omit<AnimalProps, 'makeSound' | 'type'>> = ({
  name,
  ...props
}) => {
  return (
    <Animal name={name} type="bird" makeSound={() => 'Tweet'} {...props} />
  );
};

// 4. 고급 기능을 가진 동물 컴포넌트
interface PerformingAnimalProps extends AnimalProps {
  tricks: string[];
}

const PerformingAnimal: React.FC<PerformingAnimalProps> = ({
  tricks,
  ...animalProps
}) => {
  return (
    <div>
      <Animal {...animalProps} />
      <div className="tricks">
        <h4>Special Tricks:</h4>
        <ul>
          {tricks.map((trick) => (
            <li key={trick}>{trick}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 장점

// 1. 타입 안정성
// 모든 동물 컴포넌트가 일관된 인터페이스를 따름
const animals: AnimalProps[] = [
  { name: 'Whiskers', type: 'mammal', makeSound: () => 'Meow' },
  { name: 'Rover', type: 'mammal', makeSound: () => 'Woof' },
];

// 2. 확장성
// 새로운 동물 추가가 쉬움
const Snake: React.FC<Omit<AnimalProps, 'makeSound' | 'type'>> = ({
  name,
  ...props
}) => {
  return (
    <Animal name={name} type="reptile" makeSound={() => 'Hiss'} {...props} />
  );
};

// 3. 컴포지션을 통한 확장
const AnimalWithStats: React.FC<AnimalProps & { stats: AnimalStats }> = ({
  stats,
  ...animalProps
}) => (
  <div>
    <Animal {...animalProps} />
    <AnimalStatistics stats={stats} />
  </div>
);

// 4. 테스트 용이성
test('Animal makes correct sound', () => {
  const mockSound = jest.fn(() => 'Test Sound');
  render(<Animal name="Test Animal" type="mammal" makeSound={mockSound} />);
  expect(screen.getByText('Test Sound')).toBeInTheDocument();
});

//이러한 구조는 다음과 같은 상황에서 특히 유용합니다:
// 🎯 컴포넌트 계층 구조가 복잡할 때
// 🔄 여러 종류의 비슷한 컴포넌트가 필요할 때
// 🧪 철저한 타입 검사가 필요할 때
// 📦 기능을 쉽게 확장하고 싶을 때
