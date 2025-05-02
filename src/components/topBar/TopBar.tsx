import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import * as React from 'react';

export interface Props {
  title: string;
}

interface State {}

class TopBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title } = this.props;
    return (
      <HStack className="items-center px-5 py-2">
        <Text className="text-xl text-white">{title}</Text>
      </HStack>
    );
  }
}

export default TopBar;
