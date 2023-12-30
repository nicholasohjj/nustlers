import json

# Load input data from the file
with open('venues.json', 'r') as file:
    venues_data = json.load(file)

# Check if venues_data is a list and then iterate over each venue
if isinstance(venues_data, list):
    seen = set()
    new_data = []
    for item in venues_data:
        key = (item['roomCode'], item['roomName'])
        if key not in seen:
            seen.add(key)
            new_data.append(item)
# Saving the updated data as a JSON file
with open('converted_output.json', 'w') as file:
    json.dump(new_data, file, indent=4)
