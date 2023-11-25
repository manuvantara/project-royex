import json
import pathlib

def load_json_as_module(file: pathlib.Path):
    if not file.is_file() and not file.name.endswith(".json"):
        raise FileNotFoundError(f"The path {file} is not a json file.")

    with open(file, "r") as file:
        return json.load(file)
    
directory = pathlib.Path(__file__).parent
    
OtcMarket = load_json_as_module(directory / "OtcMarket.json")
StakeholderCollective = load_json_as_module(directory / "StakeholderCollective.json")
RoyaltyExchange = load_json_as_module(directory / "RoyaltyExchange.json")
RoyaltyPaymentPool = load_json_as_module(directory / "RoyaltyPaymentPool.json")
RoyaltyToken = load_json_as_module(directory / "RoyaltyToken.json")
Stablecoin = load_json_as_module(directory / "Stablecoin.json")
InitialRoyaltyOffering = load_json_as_module(directory / "InitialRoyaltyOffering.json")