from app import app
from flask import session
from unittest import TestCase
from boggle import Boggle


class BoggleTestCase(TestCase):

    def setUp(self):
        """Runs before each test"""
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_homepage(self):
        """Testing ('/') route & matching html displayed"""
        
        with self.client:
            res = self.client.get('/')
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('<button id="btn">Enter word</button>', html)
            self.assertIn('board', session)
            self.assertIsNone(session.get('highscore'))
            self.assertIsNone(session.get('nplays'))
            self.assertIn(b'<p>High Score:', res.data)
            self.assertIn(b'Score:', res.data)
            self.assertIn(b'Seconds Left:', res.data)


    def test_valid_word(self):
        """Test if word is valid"""

        with self.client as client:
            with client.session_transaction() as session: 
               session['board'] = [
                    ["B", "O", "G", "T", "H"], 
                    ["B", "O", "G", "T", "H"], 
                    ["B", "O", "G", "T", "H"], 
                    ["B", "O", "G", "T", "H"], 
                    ["B", "O", "G", "T", "H"]
                ]
            response = self.client.get('/check-word?word=bog')
            self.assertEqual(response.json['result'], 'ok')

    def test_invalid_word(self):
        """Test if word is in the dictionary"""

        self.client.get('/')
        res = self.client.get('/check-word?word=shockability')
        self.assertEqual(res.json['result'], 'not-on-board')

    def non_english_word(self):
        """Test if word is on the board"""

        self.client.get('/')
        res = self.client.get('/check-word?word=abcdefg')
        self.assertEqual(res.json['result'], 'not-word')
