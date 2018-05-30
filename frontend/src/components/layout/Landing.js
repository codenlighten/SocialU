import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class Landing extends Component {
  render() {
    return (
              <div className="landing">
              <div className="dark-overlay landing-inner text-light">
                <div className="container">
                  <div className="row">
                    <div className="col-md-12 text-center">
                      <h1 className="display-3 mb-4">DevHub - Connect with Developers Around the Globe :)
                      </h1>
                      <p className="lead"> Create a Developer Portfolio, Share Knowledge and Reach out to other Developers</p>
                      <hr />
                      <Link to="/register" className="btn btn-lg btn-info mr-2">Register</Link>
                      <Link to="/login" className="btn btn-lg btn-light">Login</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
          }
  }

export default Landing;