from django.test import TestCase
from .models import User, Team, Activity, Workout, Leaderboard

class ModelTests(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpass', team=self.team)

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.team, self.team)

    def test_activity_creation(self):
        activity = Activity.objects.create(user=self.user, type='run', duration=10, distance=2.5)
        self.assertEqual(activity.user, self.user)
        self.assertEqual(activity.type, 'run')

    def test_workout_creation(self):
        workout = Workout.objects.create(user=self.user, name='Pushups', description='Do 20 pushups')
        self.assertEqual(workout.user, self.user)
        self.assertEqual(workout.name, 'Pushups')

    def test_leaderboard_creation(self):
        leaderboard = Leaderboard.objects.create(user=self.user, score=50)
        self.assertEqual(leaderboard.user, self.user)
        self.assertEqual(leaderboard.score, 50)
