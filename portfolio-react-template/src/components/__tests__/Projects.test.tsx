import * as renderer from 'react-test-renderer';
import Projects from '../Projects';

it('renders correctly', () => {
  const tree = renderer.create(<Projects />).toJSON();
  expect(tree).toMatchSnapshot();
});
