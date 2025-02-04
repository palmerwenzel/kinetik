import { Text, Pressable } from 'react-native';

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function Button({ onPress, children, variant = 'primary', className = '' }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`
        py-3 px-6 rounded-neu
        ${variant === 'primary' ? 'bg-accent shadow-neu-light dark:shadow-neu-dark' : 'bg-bg-light dark:bg-bg-dark shadow-neu-light dark:shadow-neu-dark'}
        active:shadow-neu-pressed-light dark:active:shadow-neu-pressed-dark
        ${className}
      `}
    >
      <Text
        className={`
          text-center font-semibold
          ${variant === 'primary' ? 'text-white' : 'text-accent dark:text-accent-light'}
        `}
      >
        {children}
      </Text>
    </Pressable>
  );
} 