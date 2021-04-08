import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, StyleSheet, ViewPropTypes } from 'react-native';
//import { Surface, Shape, Path, Group } from '../../react-native/Libraries/ART/ReactNativeART';
import MetricsPath from 'art/metrics/path';
import { Surface, Shape, Path, Group } from '@react-native-community/art';

export default class CircularProgress extends React.Component {

  circlePath(cx, cy, r, startDegree, endDegree) {
    let p = Path();
    if (Platform.OS === 'ios') {
      p.path.push(0, cx + r, cy);
      p.path.push(4, cx, cy, r, startDegree * Math.PI / 180, endDegree * Math.PI / 180, 1);
    } else {
      // For Android we have to resort to drawing low-level Path primitives, as ART does not support
      // arbitrary circle segments. It also does not support strokeDash.
      // Furthermore, the ART implementation seems to be buggy/different than the iOS one.
      // MoveTo is not needed on Android
      p.path.push(4, cx, cy, r, startDegree * Math.PI / 180, (startDegree - endDegree) * Math.PI / 180, 0);
    }
    return p;
  }

  extractFill(fill) {
    if (fill < 0.01) {
      return 0;
    } else if (fill > 100) {
      return 100;
    }

    return fill;
  }

  render() {
    const {
      showCircleBorder, size, width, tintColor, backgroundColor, style, rotation, children,
    } = this.props;
    const backgroundPath = this.circlePath(size / 2, size / 2, size / 2 - width / 2, 0, 360);

    const fill = this.extractFill(this.props.fill);
    const circlePath = this.circlePath(size / 2, size / 2, size / 2 - width / 2, 0, 360 * fill / 100);

    const circleBorder = showCircleBorder ? (
        <Shape
            d={backgroundPath}
            stroke={backgroundColor}
            strokeWidth={width}
        />
    ) : null;

    return (
        <View style={[style]}>
          <Surface
              width={size}
              height={size}
          >
            <Group rotation={rotation - 90} originX={size / 2} originY={size / 2}>
              <Shape
                  d={backgroundPath}
                  stroke={backgroundColor}
                  strokeWidth={width}
              />
              <Shape
                  d={circlePath}
                  stroke={tintColor}
                  strokeWidth={width}
                  strokeCap="butt"
              />
            </Group>
          </Surface>
          <View style={styles.children}>
            {children}
          </View>
        </View>
    );
  }
}

CircularProgress.propTypes = {
  style: ViewPropTypes.style,
  size: PropTypes.number.isRequired,
  fill: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  tintColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  rotation: PropTypes.number,
  showCircleBorder: PropTypes.bool,
  children: PropTypes.any,
};

CircularProgress.defaultProps = {
  tintColor: 'black',
  backgroundColor: '#e4e4e4',
  rotation: 90,
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'rgb(237, 59, 59)',
    borderRadius: 50,
  },
  children: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
