import * as renderer from 'react-test-renderer';
import Skills from '../Skills';

it('renders correctly', () => {
  const tree = renderer.create(<Skills />).toJSON();
  expect(tree).toMatchSnapshot();
});
