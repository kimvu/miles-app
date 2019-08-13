import React from 'react';
import ReactDOM from 'react-dom';
import App from './Overview';
import {shallow} from 'enzyme';


it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
it('renders movies', () => {
    const wrapper = shallow(<App/>);
    const welcome = <h4 style={{color: '#C0C0C0'}}>Sort on rating</h4>
    // expect(wrapper.contains(welcome)).toBe(true);
    expect(wrapper.contains(welcome)).toEqual(true);
})