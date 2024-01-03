import json

# Load input data from the file
with open('converted_output.json', 'r') as file:
    venues_data = json.load(file)

# Check if venues_data is a list
room_codes = set()
for code in venues_data["roomCode"]:
    # Split the roomCode at the hyphen and take the first part
    main_code = code.split('-')[0]
    room_codes.add(main_code)

# Convert the set to a sorted list
sorted_room_codes = sorted(list(room_codes))

# Create the final dictionary
new_data = {"roomCode": sorted_room_codes}


# Saving the updated data as a JSON file
with open('converted_output.json', 'w') as file:
    json.dump(new_data, file, indent=4)
