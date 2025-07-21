import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';

const Loading = () => {
  return (
    <Box className="flex-1 bg-custom-background justify-center">
      <Spinner size="large" />
    </Box>
  );
};

export default Loading;
