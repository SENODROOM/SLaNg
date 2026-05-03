import sys
import pickle
import warnings


warnings.filterwarnings("ignore")

def predict(text):
    try:
       
        with open("model.pkl", "rb") as file:
            model = pickle.load(file)
            
       
        prediction = model.predict([text])[0]
        
       
        print(prediction)
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)

if __name__ == "__main__":
    
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        predict(input_text)
    else:
        print("Error: No text provided to predict.", file=sys.stderr)
