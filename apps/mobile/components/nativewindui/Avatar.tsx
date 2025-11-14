import {
  Fallback as AvatarPrimitiveFallback,
  Image as AvatarPrimitiveImage,
  Root as AvatarPrimitiveRoot,
  type FallbackProps,
  type ImageProps,
  type RootProps,
} from '@rn-primitives/avatar';

import { cn } from '@/lib/cn';

function Avatar({ className, ...props }: RootProps) {
  return (
    <AvatarPrimitiveRoot
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: ImageProps) {
  return (
    <AvatarPrimitiveImage className={cn('aspect-square h-full w-full', className)} {...props} />
  );
}

function AvatarFallback({ className, ...props }: FallbackProps) {
  return (
    <AvatarPrimitiveFallback
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
