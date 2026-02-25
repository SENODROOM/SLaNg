# SLaNg Math Library - Interactive Web Demo

A beautiful, interactive web interface for exploring the SLaNg Math Library capabilities.

## 🚀 Quick Start

### Option 1: Run with Node.js (Recommended)
```bash
cd web-demo
node server.js
```
Then open http://localhost:3000 in your browser.

### Option 2: Open Directly
Simply open `index.html` in your web browser. Note: Some features may be limited due to CORS restrictions.

## 🎯 Features

### 🔄 LaTeX Converter
- **SLaNg to LaTeX**: Convert SLaNg JSON expressions to beautiful LaTeX
- **LaTeX to SLaNg**: Parse LaTeX expressions back to SLaNg format
- **Real-time Preview**: See rendered LaTeX using KaTeX
- **Example Library**: Quick-load common expression types

### 🧮 Calculus Operations
- **Differentiation**: Compute derivatives with step-by-step display
- **Numerical Integration**: Simpson's rule integration with bounds
- **Function Evaluation**: Test expressions at specific points

### 📈 Function Plotter
- **Interactive Plotting**: Visualize mathematical functions
- **Multiple Types**: Polynomials, rational functions, trigonometric
- **Custom Ranges**: Adjustable x-axis bounds
- **Beautiful Rendering**: Using Plotly.js for smooth, interactive plots

### 🔬 Extended Functions
- **Trigonometric**: sin, cos, tan, arcsin, arccos, arctan
- **Logarithmic**: ln, log, exp, sqrt
- **Real-time Evaluation**: Instant results as you type

### ⚡ Performance Monitoring
- **Benchmark Suite**: Test conversion and calculation speeds
- **Cache Statistics**: Monitor caching performance
- **Operation Metrics**: Detailed performance analytics

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Gradient backgrounds, smooth animations, hover effects
- **Tabbed Interface**: Organized functionality with easy navigation
- **Error Handling**: Graceful error display and recovery suggestions
- **Dark Mode Ready**: Easy on the eyes during extended use

## 🛠️ Technical Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Math Rendering**: KaTeX for beautiful LaTeX display
- **Plotting**: Plotly.js for interactive graphs
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Emoji and Unicode symbols for universal compatibility

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ Internet Explorer (Not supported)

## 🔧 Customization

### Adding New Examples
Edit the `loadSlangExample()` and `loadLatexExample()` functions in `index.html`:

```javascript
function loadSlangExample(type) {
    const examples = {
        newType: '{"coeff": 3, "var": {"x": 4, "y": 2}}'
        // Add more examples...
    };
    input.value = examples[type];
}
```

### Styling Changes
Modify the CSS variables in the `<style>` section:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --error-color: #dc3545;
}
```

### Adding New Tabs
1. Add a tab button in the HTML:
```html
<div class="tab" onclick="switchTab('newTab')">🆕 New Feature</div>
```

2. Add the tab content:
```html
<div id="newTab" class="tab-content">
    <!-- Your content here -->
</div>
```

3. Add the switching logic in `switchTab()` function.

## 🚀 Production Deployment

### Static Hosting
The demo works perfectly on static hosting services:
- Netlify
- Vercel
- GitHub Pages
- Surge.sh

Simply upload the `web-demo` folder contents.

### Node.js Server
Use the included server.js for Node.js deployment:
```bash
npm install -g http-server
http-server web-demo -p 3000
```

### Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## 📊 Performance Tips

1. **Enable Caching**: The demo includes performance monitoring
2. **Use Modern Browser**: Chrome/Firefox offer best performance
3. **Disable Extensions**: Some browser extensions can slow down math rendering
4. **Update Browser**: Latest versions have optimized JavaScript engines

## 🐛 Troubleshooting

### LaTeX Not Rendering
- Check browser console for JavaScript errors
- Ensure KaTeX CDN is accessible
- Try refreshing the page

### Plots Not Displaying
- Verify Plotly.js CDN is loaded
- Check for JavaScript errors in console
- Ensure input format is correct

### Server Not Starting
- Check if port 3000 is already in use
- Try a different port: `PORT=8080 node server.js`
- Verify Node.js version (16+ recommended)

## 🤝 Contributing

Want to improve the demo? Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b amazing-feature`
3. **Make your changes**
4. **Test thoroughly**: Open in multiple browsers
5. **Submit a pull request**

### Areas for Improvement
- [ ] Add more function types (hyperbolic, custom)
- [ ] Implement equation solver
- [ ] Add 3D plotting capabilities
- [ ] Create tutorial mode
- [ ] Add export functionality (SVG, PNG)
- [ ] Implement history/undo functionality

## 📄 License

This demo is part of the SLaNg Math Library and follows the same MIT License.

## 🙏 Acknowledgments

- **KaTeX**: Beautiful math rendering
- **Plotly.js**: Interactive plotting
- **MDN**: Web standards documentation
- **SLaNg Community**: Feature suggestions and feedback

---

**Enjoy exploring mathematical concepts with SLaNg! 🎉**
