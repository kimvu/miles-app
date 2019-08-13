import React, {Component} from 'react';
import {Col, Row, Button} from 'antd';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import './index.css';

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: this.props.movie,
        }
    }


    render() {
        const genre = this.props.movie.genres.map((item, key) =>
            <Row key={key}>{item}</Row>
        );
        const actors = this.props.movie.actors.map((item, key) =>
            <Row key={key}>{item}</Row>
        );
        const movie = this.props.movie;
        return (
            <div>
                <Col>
                    <Row>
                        <Button onClick={this.props.openDetails}>Return</Button>
                    </Row>
                    <Row>
                        <img src={movie.posterurl}/>
                        <h1 style={{color:'#C0C0C0'}}>{movie.title}</h1>
                        <Row style={{marginTop:'10px',borderTop: '1px solid #666666'}}>
                            <Col md={10}>
                                Genres:
                            </Col>
                            <Col md={10}>
                                {genre}
                            </Col>
                        </Row>
                        <Row style={{marginTop:'10px',borderTop: '1px solid #666666'}}>
                            <Col md={10}>
                                Actors:
                            </Col>
                            <Col md={10}>
                                {actors}
                            </Col>
                        </Row>
                        <Row style={{marginTop:'10px',borderTop: '1px solid #666666'}}>
                            <Col md={10}>
                                Description:
                            </Col>
                            <Col md={10}>
                                {movie.storyline}
                            </Col>
                        </Row>
                        <Row style={{marginTop:'10px',borderTop: '1px solid #666666'}}>
                            <Col md={10}>
                                Rating:
                            </Col>
                            <Col md={10}>
                                {this.props.getAverageRating(movie)}
                            </Col>
                        </Row>
                    </Row>
                </Col>
            </div>
        );
    }

}

export default Details;
