import json

# Load input data from the file

with open('venues.json', 'r') as file:
    input_data = json.load(file)

# Converting the data
filtered_data = [item for item in input_data if 'coordinate' in item]

# Saving the output as a JSON file
with open('converted_output.json', 'w') as file:
    json.dump(filtered_data, file, indent=4)
