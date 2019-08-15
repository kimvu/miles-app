import React, {Component} from 'react';
import {Icon, Col, Card, Row, Switch, Button, Select} from 'antd';
import axios from 'axios';
import Details from './Details';
import './App.css';
import 'antd/dist/antd.css';
import './index.css';

const {Option} = Select;
const path = 'http://localhost:3000/data/';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            shownMovies: [],
            favMovies: [],
            showFav: false,
            showDetails: null,
            yearsData: [],
            selectedYear: "none",
            sortBest: false,
            sortWorst: false,

        }
        this.openDetails = this.openDetails.bind(this);
        this.getAverageRating = this.getAverageRating.bind(this);
        this.getMovies();
    }

    getMovies(parameter) {
        if (parameter) {
            axios.get(path + '?' + parameter)
                .then(resp => {
                    this.setState({shownMovies: resp.data});
                    this.getYears();
                })
        } else {
            axios.get(path)
                .then(resp => {
                    this.setState({movies: resp.data, shownMovies: resp.data});
                    this.getYears();
                })
        }
    }
    getAverageRating(item){
        return Math.round((item.ratings.reduce((previous, current) => current += previous)) / item.ratings.length * 10) / 10
    }

    getYears() {
        let years = []
        this.state.movies.map((item, key) => {
                if (!years.includes(item.year)) {
                    years.push(item.year)
                }
            }
        )
        this.setState({yearsData: years});
    }

    removeFav(id) {
        var array = [...this.state.favMovies]; // make a separate copy of the array
        var index = array.indexOf(id)
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({favMovies: array});
        }
    }

    handleFav = (id) => {
        if (this.state.favMovies.includes(id)) {
            this.removeFav(id)
        } else {
            this.setState({favMovies: this.state.favMovies.concat(id)});
        }
    }
    filterFav = () => {
        if (this.state.showFav) {
            this.setState({showFav: false});
        } else {
            this.setState({showFav: true});
        }

    }
    openDetails = (e) => {
        if (this.state.showDetails) {
            this.setState({showDetails: null})
        } else {
            this.setState({showDetails: e})
        }
    }
    filterYear = (e) => {
        if (e === "none") {
            this.getMovies()
        } else {
            this.getMovies("year=" + e);
            this.setState({shownMovies: this.state.movies, selectedYear: e})
        }
    }
    sortBestRating = () => {
        this.setState({
            sortBest:true,
            sortWorst:false
        })
    }
    sortWorstRating = () => {
        this.setState({
            sortWorst: true,
            sortBest:false,
        })
    }
    noSortRating = () => {
        this.setState({
            sortBest: false,
            sortWorst: false,
        })
        if (this.state.selectedYear === "none") {
            this.getMovies()
        } else {
            this.getMovies("year=" + this.state.selectedYear);
        }
    }

    render() {
        let movies = this.state.shownMovies;
        if (this.state.showFav) {
            movies = movies.filter(item => {
                return this.state.favMovies.includes(item.id);
            })
        }
        if (this.state.sortBest) {
            movies.sort((a,b) => this.getAverageRating(b) - this.getAverageRating(a))
        } else if (this.state.sortWorst) {
            movies.sort((a,b) => this.getAverageRating(a) - this.getAverageRating(b))
        }

        const movieElements = movies.map((item, key) =>
            <Col key={key} lg={8} sm={12} style={{marginTop: 36}}>
                <div style={{border: "solid 1px #e9e9e9"}}>
                    <Row>
                        <Card style={{
                            height: 400,
                            backgroundImage: 'url(' + item.posterurl + ')',
                            backgroundSize: 'cover', backgroundPosition: 'center', color: "white"
                        }}/>
                    </Row>
                    <Row style={{margin: 0, width: '100%', backgroundColor: 'white', color: "#666666", fontSize:'20px'}}>
                        <Col md={30}>
                            <p>{item.title}</p>
                        </Col>
                        <Col md={12}>
                            <p>Year: {item.year}</p>
                        </Col>
                        <Col md={12}>
                            <p>Rating: {this.getAverageRating(item)}</p>
                        </Col>
                        <Col md={12}>
                            <Icon type="star" theme={this.state.favMovies.includes(item.id) ? "filled" : "outlined"}
                                  onClick={(e) => this.handleFav(item.id)} style={{fontSize: '30px'}}></Icon>
                            <Icon type="info-circle" onClick={(e) => this.openDetails(item)}
                                  style={{fontSize: '30px'}}></Icon>
                        </Col>

                    </Row>
                </div>
            </Col>
        );

        const years = this.state.yearsData.map((item, key) =>
            <Option value={item} key={key}>{item}</Option>
        );

        return (
            <div className="App">
                <header className="App-header">
                    <h1 style={{color: '#C0C0C0'}}>Movies</h1>
                    {
                        this.state.showDetails ?
                            <div>
                                <Details movie={this.state.showDetails} openDetails={this.openDetails} getAverageRating={this.getAverageRating}/>
                            </div>
                            :
                            <div style={{width:'100%'}}>
                                <Row>
                                    <Col md={5} lg={5}>
                                        <h4 style={{color: '#C0C0C0'}}>Filter on favorites</h4>
                                        <Switch checked={this.state.showFav} onChange={this.filterFav}/>
                                    </Col>
                                    <Col md={5} lg={5}>
                                        <h4 style={{color: '#C0C0C0'}}>Filter on year</h4>
                                        <Select onChange={this.filterYear} style={{width: 150}}
                                                defaultValue={this.state.selectedYear}>
                                            <Option value="none">none</Option>
                                            {years}
                                        </Select>
                                    </Col>
                                    <Col md={5} lg={5}>
                                        <h4 style={{color: '#C0C0C0'}}>Sort on rating</h4>
                                        <Icon type="like" theme={this.state.sortBest ? "filled" : "outlined"}
                                              style={{marginLeft: '10px', marginRight: '10px'}}
                                              onClick={this.sortBestRating}></Icon>
                                        <Icon type="stop" style={{marginLeft: '10px', marginRight: '10px'}}
                                              onClick={this.noSortRating}></Icon>
                                        <Icon type="dislike" theme={this.state.sortWorst ? "filled" : "outlined"}
                                              style={{marginLeft: '10px', marginRight: '10px'}}
                                              onClick={this.sortWorstRating}></Icon>
                                    </Col>
                                </Row>
                                <div style={{margin: "0 36px 36px 36px"}}>
                                    <Row gutter={16}>
                                        {movieElements}
                                    </Row>
                                </div>
                            </div>
                    }

                </header>
            </div>
        );
    }

}

export default Overview;
