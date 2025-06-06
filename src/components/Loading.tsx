import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import colors from 'tailwindcss/colors';

const Loading = () => {
  return (
    <Box className="flex-1 bg-[#0594ae] justify-center">
      <Spinner size="large" color={colors.white} />
    </Box>
  );
};

export default Loading;
