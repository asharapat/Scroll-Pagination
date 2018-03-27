import React from 'react';
import './App.css';
import { compose } from 'recompose';
import axios from 'axios';


const applyUpdateResult = (result) => (prevState) => ({
  hits: [...prevState.hits, ...result.hits],
  page: result.page,
  isLoading: false,
});

const applySetResult = (result) => (prevState) => ({
  hits: result.hits,
  page: result.page,
  isLoading: false,
});

const getHackerNewsUrl = (value,page) =>
    `https://hn.algolia.com/api/v1/search?query=${value}&page=${page}&hitsPerPage=100`;

const withLoading = (Component) => (props) =>
  <div>
    <Component {...props} />

    <div className="interactions">
      {props.isLoading && <span>Loading...</span>}
    </div>
  </div>
       
const withPaginated = (Component) => (props) =>
  <div>
    <Component {...props} />

    <div className="interactions">
      {
        (props.page !== null && !props.isLoading) &&
        <button
          type="button"
          onClick={props.onPaginatedSearch}
        >
          More
        </button>
      }
    </div>
  </div>

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hits: [],
      page: null,
      isLoading: false,
      value: '',
    };
  }

  onInitialSearch = (e) => {
    e.preventDefault();

    const { value } = this.state.value;

    if (value === '') {
      return;
    }

    this.fetchStories(value, 0);
  }
  
  onPaginatedSearch = (e) =>
    this.fetchStories(this.state.value, this.state.page + 1);

  fetchStories = (value, page) =>{
    this.setState({isLoading: true});
    fetch(getHackerNewsUrl(this.state.value,page))
      .then(response => response.json())
      .then(result => {
        console.log(result)
        this.onSetResult(result, page)});

  }

  onSetResult(result, page){ 
    if(page === 0){
        console.log(result+"111111111111111111111111111")
        this.setState(applySetResult(result))
    }
    else{
        console.log(result+"22222222222222222222222222")
        this.setState(applyUpdateResult(result))
    }
  }
//    page === 0
//      ? this.setState(applySetResult(result))
//      : this.setState(applyUpdateResult(result));

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div className="page">
        <div className="interactions">
          <form type="submit" onSubmit={this.onInitialSearch}>
              <input type="text" value={this.state.value} onChange={e => this.handleChange(e)}/>
            <button type="submit">Search</button>
          </form>
        </div>

        <ListWithLoadingWithPaginated
          list={this.state.hits}
          isLoading={this.state.isLoading}
          page={this.state.page}
          onPaginatedSearch={this.onPaginatedSearch}
        />
      </div>
    );
  }
}

const List = ({ list }) =>
  <div className="list">
    {list.map(item => <div className="list-row" key={item.objectID}>
      <a href={item.url}>{item.title}</a>
    </div>)}
  </div>

const ListWithLoadingWithPaginated = compose(
  withPaginated,
  withLoading,
)(List);

export default App;


