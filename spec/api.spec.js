process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const seed = require('../seed/test.seed');
const PORT = require('../config').PORT[process.env.NODE_ENV];
const ROOT = `http://localhost:${PORT}/api`;

// SERVER
require('../server');

before(done => {
  mongoose.connection.once('connected', () => {
    mongoose.connection.db.dropDatabase(() => {
    });
    seed((idObj) => {
            sampleIds = idObj;
            invalidId = sampleIds.article_id.toString().split('');
            invalidId[invalidId.length - 1] = '5345';
            invalidId = invalidId.join('');
            incorrectId = '5841a06fed9db244975922c3';

            console.log(sampleIds);
            done();
        });
  });
});

// after(done => {
//     mongoose.connection.db.dropDatabase(() => {
//       console.log('Tests completed');
//       done();
//     });
//   });

describe('API ROUTES', () => {
  describe('GET /api', () => {
    it('should return status is OK', (done) => {
      request(ROOT)
        .get('/')
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.body.status).to.equal('OK');
          done();
        });
    });
  });

  // describe('GET /not-found-route', () => {
  //   it('should return status 400', (done) => {
  //     request(`${ROOT}/not-found-route`)
  //       .get('/')
  //       .end((error, response) => {
  //         if (error) throw error;
  //         expect(response.status).to.equal(404);
  //         expect(response.body.status).to.equal('ROUTE NOT FOUND');
  //         done();
  //       });
  //   });
  // });

  describe('GET /api/topics', () => {
    it('should return all the topics', (done) => {
      request(`${ROOT}/topics`)
        .get('/')
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.error).to.be.false;
          expect(res.body.topics).to.exist;
          // expect(res.body.topics[0].title).to.equal('Football');
          done();
        });
    });
  });

  describe('GET /api/topics/football/articles', () => {
    it('should return all the articles from football topic', (done) => {
      request(`${ROOT}/topics/football/articles`)
        .get('/')
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.error).to.be.false;
          expect(res.body.articles).to.exist;
          expect(res.body.articles[0].belongs_to).to.equal('football');
          done();
        });
    });
  });

  describe('GET /api/articles', () => {
    it('should return all the articles', (done) => {
      request(`${ROOT}/articles`)
        .get('/')
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.error).to.equal(false);
          expect(res.body.results).to.exist;
          // expect(res.body.results[0].title).to.equal('Football is fun');
          done();
        });
    });
  });

  describe('GET /api/articles/:article_id', () => {
    it('should return the article by its ID', (done) => {
      request(`${ROOT}/articles/${sampleIds.article_id}`)
        .get('/')
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.error).to.be.false;
          expect(res.body.articles).to.exist;
          expect(res.body.articles.title).to.equal('Cats are great');
          done();
        });
    });
  });

  describe('GET /api/articles/:article_id/comments', () => {
    it('should return all the comments from a certain article', (done) => {
      request(`${ROOT}/articles/${sampleIds.article_id}/comments`)
        .get('/')
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.error).to.be.false;
          expect(res.body.comments).to.exist;
          expect(res.body.comments.every((comment) => comment.hasOwnProperty('body'))).to.equal(true);
          done();
        });
    });
  });

  describe('GET /api/users', () => {
    it('should return all the users', (done) => {
      request(`${ROOT}/users`)
        .get('/')
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.error).to.be.false;
          done();
        });
    });
  });

  describe('GET /api/users/northcoder', () => {
    it('should return the northcoder user', (done) => {
      request(`${ROOT}/users/northcoder`)
        .get('/')
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.error).to.be.false;
          expect(res.body.users[0].username).to.equal('northcoder');
          done();
        });
    });
  });

  describe('POST /api/articles/:article_id/comments', () => {
    it('should post a new comment to the certain article', (done) => {
      let comment = {
        "body": "This is a test comment",
        "belongs_to": sampleIds.article_id
      }
      request(ROOT)
      .post(`/articles/${sampleIds.article_id}/comments`)
      .send(comment)
      .end((err, res) => {
        if (err) throw err;
        expect(res.statusCode).to.equal(201);
        expect(res.error).to.be.false;
        expect(res.body.comment).to.exist;
        expect(res.body.comment).to.have.property('_id');
        expect(res.body.comment).to.have.property('belongs_to');
        expect(res.body.comment).to.have.property('body');
        expect(res.body.comment).to.have.property('created_at');
        expect(res.body.comment).to.have.property('created_by');
        expect(res.body.comment).to.have.property('votes');
        done();
      });
    });
  });

  describe('PUT /api/articles/:article_id', () => {
    it('should upvote a article', (done) => {
      request(ROOT)
        .put(`/articles/${sampleIds.article_id}?vote=up`)
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(201);
          expect(res.error).to.be.false;
          expect(res.body).to.have.property('vote');
          expect(res.body).to.eql({"vote": "up worked"});
          done();
        });
    });
    it('should downvote a article', (done) => {
      request(ROOT)
        .put(`/articles/${sampleIds.article_id}?vote=down`)
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(201);
          expect(res.error).to.be.false;
          expect(res.body).to.have.property('vote');
          expect(res.body).to.eql({"vote": "down worked"});
          done();
        });
    });
  });

  describe('PUT /api/comments/:comment_id', () => {
    it('should upvote a comment', (done) => {
      request(ROOT)
        .put(`/comments/${sampleIds.comment_id}?vote=up`)
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(201);
          expect(res.error).to.be.false;
          expect(res.body).to.have.property('vote');
          expect(res.body).to.eql({"vote": "up worked"});
          done();
        });
    });
    it('should downvote a comment', (done) => {
      request(ROOT)
        .put(`/comments/${sampleIds.comment_id}?vote=down`)
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(201);
          expect(res.error).to.be.false;
          expect(res.body).to.have.property('vote');
          expect(res.body).to.eql({"vote": "down worked"});
          done();
        });
    });
  });

  describe('DELETE /api/comments/:comment_id', () => {
    it('should upvote a comment', (done) => {
      request(ROOT)
        .delete(`/comments/${sampleIds.comment_id}`)
        .end((err, res) => {
          if (err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.error).to.be.false;
          expect(res.body).to.have.property('comment');
          expect(res.body.comment).to.eql('DELETED');
          done();
        });
    });
  });
});
