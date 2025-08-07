from app.utilities.sample_data import get_sample_data

def test_sample_data():
    """
    Test function to validate the structure and content of the sample data.
    """
    data = get_sample_data()
    
    print(data['skills'])

test_sample_data()