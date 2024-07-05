import React from 'react';
import './Paragraph.scss';

interface ParagraphProps {
  class: string;
  content: string;
}

class Paragraph extends React.Component<ParagraphProps> { 

    render() {
        return (
            <p className={`a-paragraph ${this.props.class ?? ''}`}>
              {this.props.content}
            </p>
          );
    }
};

export default Paragraph;

