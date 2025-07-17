import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';

const Loading = () => {
  return (
    <Box className="flex-1 bg-custom-background justify-center">
      <Spinner size="large" color={'var(--color-custom-bg-inverse)'} />
    </Box>
  );
};

export default Loading;
