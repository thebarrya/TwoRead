import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface NatureBackgroundProps {
  children?: React.ReactNode;
}

export const NatureBackground: React.FC<NatureBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Dégradé du ciel */}
      <LinearGradient
        colors={['#87CEEB', '#B4E5F9', '#D4F1F4', '#E8F5E9', '#81C784']}
        locations={[0, 0.3, 0.5, 0.7, 1]}
        style={styles.gradient}
      />

      {/* Nuages */}
      <Svg height={height * 0.3} width={width} style={styles.clouds}>
        {/* Nuage 1 */}
        <Ellipse cx="60" cy="40" rx="35" ry="25" fill="#FFFFFF" opacity="0.8" />
        <Ellipse cx="90" cy="45" rx="40" ry="28" fill="#FFFFFF" opacity="0.8" />
        <Ellipse cx="115" cy="40" rx="30" ry="22" fill="#FFFFFF" opacity="0.8" />

        {/* Nuage 2 */}
        <Ellipse cx={width - 80} cy="60" rx="40" ry="25" fill="#FFFFFF" opacity="0.7" />
        <Ellipse cx={width - 50} cy="65" rx="35" ry="22" fill="#FFFFFF" opacity="0.7" />

        {/* Nuage 3 */}
        <Ellipse cx={width * 0.5} cy="80" rx="45" ry="30" fill="#FFFFFF" opacity="0.6" />
        <Ellipse cx={width * 0.5 + 30} cy="85" rx="35" ry="25" fill="#FFFFFF" opacity="0.6" />

        {/* Petites étoiles/brillances */}
        <Circle cx="30" cy="25" r="3" fill="#FFE082" opacity="0.8" />
        <Circle cx="50" cy="15" r="2" fill="#FFE082" opacity="0.6" />
        <Circle cx={width - 40} cy="30" r="2.5" fill="#FFE082" opacity="0.7" />
        <Circle cx={width - 100} cy="20" r="2" fill="#FFE082" opacity="0.8" />
        <Circle cx={width * 0.6} cy="35" r="2" fill="#FFE082" opacity="0.6" />
      </Svg>

      {/* Collines/Savane */}
      <Svg height={height * 0.4} width={width} style={styles.hills}>
        {/* Colline arrière */}
        <Path
          d={`M0,${height * 0.25} Q${width * 0.25},${height * 0.15} ${width * 0.5},${height * 0.2} T${width},${height * 0.25} L${width},${height} L0,${height} Z`}
          fill="#66BB6A"
          opacity="0.6"
        />

        {/* Colline du milieu */}
        <Path
          d={`M0,${height * 0.3} Q${width * 0.3},${height * 0.22} ${width * 0.6},${height * 0.28} T${width},${height * 0.32} L${width},${height} L0,${height} Z`}
          fill="#4CAF50"
          opacity="0.8"
        />

        {/* Colline avant (herbe) */}
        <Path
          d={`M0,${height * 0.35} Q${width * 0.2},${height * 0.3} ${width * 0.4},${height * 0.33} T${width * 0.8},${height * 0.36} T${width},${height * 0.38} L${width},${height} L0,${height} Z`}
          fill="#43A047"
        />

        {/* Petites fleurs décoratives */}
        {/* Fleur 1 */}
        <Circle cx="50" cy={height * 0.36} r="4" fill="#FFB74D" />
        <Circle cx="46" cy={height * 0.36 - 3} r="3" fill="#FFB74D" />
        <Circle cx="54" cy={height * 0.36 - 3} r="3" fill="#FFB74D" />
        <Circle cx="46" cy={height * 0.36 + 3} r="3" fill="#FFB74D" />
        <Circle cx="54" cy={height * 0.36 + 3} r="3" fill="#FFB74D" />
        <Circle cx="50" cy={height * 0.36} r="2" fill="#FFF59D" />

        {/* Fleur 2 */}
        <Circle cx={width - 60} cy={height * 0.37} r="3.5" fill="#E91E63" />
        <Circle cx={width - 63} cy={height * 0.37 - 2.5} r="2.5" fill="#E91E63" />
        <Circle cx={width - 57} cy={height * 0.37 - 2.5} r="2.5" fill="#E91E63" />
        <Circle cx={width - 63} cy={height * 0.37 + 2.5} r="2.5" fill="#E91E63" />
        <Circle cx={width - 57} cy={height * 0.37 + 2.5} r="2.5" fill="#E91E63" />
        <Circle cx={width - 60} cy={height * 0.37} r="1.5" fill="#FFF59D" />

        {/* Fleur 3 */}
        <Circle cx={width * 0.3} cy={height * 0.35} r="3" fill="#AB47BC" />
        <Circle cx={width * 0.3 - 2} cy={height * 0.35 - 2} r="2" fill="#AB47BC" />
        <Circle cx={width * 0.3 + 2} cy={height * 0.35 - 2} r="2" fill="#AB47BC" />
        <Circle cx={width * 0.3 - 2} cy={height * 0.35 + 2} r="2" fill="#AB47BC" />
        <Circle cx={width * 0.3 + 2} cy={height * 0.35 + 2} r="2" fill="#AB47BC" />
        <Circle cx={width * 0.3} cy={height * 0.35} r="1" fill="#FFF59D" />

        {/* Herbes */}
        <Path
          d={`M${width * 0.15},${height * 0.38} Q${width * 0.15 + 5},${height * 0.36} ${width * 0.15 + 10},${height * 0.38}`}
          stroke="#2E7D32"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d={`M${width * 0.7},${height * 0.39} Q${width * 0.7 + 5},${height * 0.37} ${width * 0.7 + 10},${height * 0.39}`}
          stroke="#2E7D32"
          strokeWidth="2"
          fill="none"
        />
      </Svg>

      {/* Contenu */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  clouds: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  hills: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});
